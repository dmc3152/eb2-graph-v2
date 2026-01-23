import { IncomingMessage, ServerResponse } from 'http'
import { mkdir, writeFile } from 'fs/promises'
import path from 'path'
import { sanitizeFilename } from './fileUploadUtils'
import { ulid } from 'ulid'

export interface UploadConfig {
  uploadDir: string
  maxFileSize?: number // in bytes, default 50MB
  allowedMimeTypes?: string[]
}

export interface UploadResult {
  success: boolean
  filename?: string
  path?: string
  size?: number
  error?: string
}

/**
 * Parses multipart form data from request
 * Supports both file uploads and text fields
 */
export async function parseMultipartForm(
  req: IncomingMessage,
  maxFileSize: number = 50 * 1024 * 1024
): Promise<{ files: Map<string, Buffer>; fields: Map<string, string> }> {
  return new Promise((resolve, reject) => {
    const files = new Map<string, Buffer>()
    const fields = new Map<string, string>()
    const chunks: Buffer[] = []

    let currentSize = 0

    req.on('data', (chunk: Buffer) => {
      currentSize += chunk.length
      if (currentSize > maxFileSize) {
        reject(new Error(`File size exceeds limit of ${maxFileSize} bytes`))
      }
      chunks.push(chunk)
    })

    req.on('end', () => {
      try {
        const buffer = Buffer.concat(chunks)
        const contentType = req.headers['content-type'] || ''

        // Extract boundary from content-type header
        const boundaryMatch = contentType.match(/boundary=([^;]+)/)
        if (!boundaryMatch) {
          reject(new Error('Invalid multipart form data'))
          return
        }

        const boundary = boundaryMatch[1].trim().replace(/^"|"$/g, '')
        const parts = buffer.toString('binary').split(`--${boundary}`)

        parts.forEach((part) => {
          if (part.includes('Content-Disposition')) {
            const headers = part.split('\r\n\r\n')[0]
            const body = part.split('\r\n\r\n').slice(1).join('\r\n\r\n').replace(/\r\n--$/, '')

            const nameMatch = headers.match(/name="([^"]+)"/)
            if (!nameMatch) return

            const name = nameMatch[1]
            const filenameMatch = headers.match(/filename="([^"]+)"/)

            if (filenameMatch) {
              // It's a file
              const filename = filenameMatch[1]
              files.set(name, Buffer.from(body, 'binary'))
            } else {
              // It's a text field
              fields.set(name, body.trim())
            }
          }
        })

        resolve({ files, fields })
      } catch (error) {
        reject(error)
      }
    })

    req.on('error', reject)
  })
}

/**
 * Handles file uploads to the filesystem
 * Returns metadata about the uploaded file
 */
export async function handleFileUpload(
  req: IncomingMessage,
  config: UploadConfig
): Promise<UploadResult> {
  try {
    const maxSize = config.maxFileSize || 50 * 1024 * 1024

    // Ensure upload directory exists
    await mkdir(config.uploadDir, { recursive: true })

    const { files, fields } = await parseMultipartForm(req, maxSize)

    if (files.size === 0) {
      return { success: false, error: 'No file provided' }
    }

    // Get the first file (or modify to handle multiple)
    const entry = files.entries().next().value
    if (!entry) {
      return { success: false, error: 'No file provided' }
    }
    const [filename, buffer] = entry

    // Validate MIME type if specified
    if (config.allowedMimeTypes) {
      const mimeType = fields.get('mimeType') || 'application/octet-stream'
      if (!config.allowedMimeTypes.includes(mimeType)) {
        return { success: false, error: `MIME type ${mimeType} not allowed` }
      }
    }

    // Generate safe filename
    const sanitizedFilename = sanitizeFilename(filename)
    const uniqueFilename = `${ulid()}-${sanitizedFilename}`
    const filePath = path.join(config.uploadDir, uniqueFilename)

    // Write file to disk
    await writeFile(filePath, buffer)

    return {
      success: true,
      filename: uniqueFilename,
      path: filePath,
      size: buffer.length
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

/**
 * HTTP request handler for file uploads
 * Sends JSON response
 */
export async function uploadHandler(
  req: IncomingMessage,
  res: ServerResponse,
  config: UploadConfig
): Promise<void> {
  try {
    const result = await handleFileUpload(req, config)

    res.writeHead(result.success ? 200 : 400, {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    })
    res.end(JSON.stringify(result))
  } catch (error) {
    res.writeHead(500, { 'Content-Type': 'application/json' })
    res.end(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : 'Server error'
      })
    )
  }
}
