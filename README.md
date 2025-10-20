# be

To install dependencies:

```bash
bun install
```

To run:

```bash
bun run src/server.ts
```

This project was created using `bun init` in bun v1.2.22. [Bun](https://bun.com) is a fast all-in-one JavaScript runtime.

## Notes
- Remember to change the cookies from 'none' to 'strict'

Restart on server
```
sudo systemctl restart eb2-graph.service
```

Service status on server
```
sudo systemctl status eb2-graph.service
```

Restart nginx
```
sudo systemctl restart nginx
```

Restart surrealdb
```
sudo systemctl restart surrealdb
```

Start redis
```
docker compose up -d
```

Stop redis
```
docker compose down
```

/etc/systemd/system
/usr/local/bin/surrealdb.sh