import { createServer } from 'http'
import { parse } from 'url'
import next from 'next'

const port = parseInt(process.env.PORT || '3000', 10)
const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()

app.prepare().then(() => {
    createServer((req, res) => {
        const parsedUrl = parse(req.url!, true)

        const referer = req.headers.referer;

        if (referer) {
            const parsedReferer = parse(referer, true).pathname || '';
            if (parsedReferer.startsWith('/api/hassio_ingress/')) {
                const addonPath = parsedReferer.split('/')[2]; 
          
                if (addonPath) {
                  req.url = `/api/hassio_ingress/${addonPath}${req.url}`;
                }
              }
        }

        handle(req, res)
    }).listen(port)

    console.log(
        `> Server listening at http://localhost:${port} as ${dev ? 'development' : process.env.NODE_ENV
        }`
    )
})