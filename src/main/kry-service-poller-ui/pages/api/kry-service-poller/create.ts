import type { NextApiRequest, NextApiResponse } from 'next'
import { externalServicesHttpClient } from '../../../services/httpService'
import { endpoints } from '../../../config'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    try {
      const createdService = await externalServicesHttpClient.post(
        endpoints.servicePollerEndpoint,
        req.body
      )
      res.status(200)
      res.json(createdService.data)
      return
    } catch (error: any) {
      if (error.status === 409) {
        res.status(409)
        res.json({
          error: 'The service already exists'
        })
        return
      } else {
        res.status(500)
        res.json({
          error: 'The following error ocurred while creating the service',
          errorMsg: error
        })
        return
      }
    }
  }
  res.status(404)
  res.json({ error: 'Method not allowed' })
  return
}
