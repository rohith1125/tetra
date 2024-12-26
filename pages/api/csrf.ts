import { NextApiRequest, NextApiResponse } from 'next'
import csrf from 'csurf'

const csrfProtection = csrf({ cookie: true })

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  csrfProtection(req, res, (error) => {
    if (error) {
      return res.status(403).json({ error: 'Invalid CSRF token' })
    }
    res.json({ csrfToken: req.csrfToken() })
  })
}

