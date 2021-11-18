import type { NextApiRequest, NextApiResponse } from 'next'
import { externalServicesHttpClient } from '../../../services/httpService'
import { endpoints } from '../../../config'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'GET') {
    try {
      const polledServices = await externalServicesHttpClient.get(endpoints.polledServicesEndpoint)
      res.status(200)
      res.json(polledServices.data)
      return
    } catch (error) {
      console.log(error)
      res.status(500)
      res.json({ error: 'Error fetching polled services', errorMsg: error })
      return
    }
  }
  res.status(404)
  res.json({ error: 'Method not allowed' })
  return
}
