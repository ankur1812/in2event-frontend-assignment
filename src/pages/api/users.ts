import type { NextApiRequest, NextApiResponse } from 'next';

const API_URL = 'https://chclkyygvktplmkjhsbc.supabase.co/rest/v1/users';
const API_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNoY2xreXlndmt0cGxta2poc2JjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzA1NDgyMjEsImV4cCI6MjA0NjEyNDIyMX0.Krp_wfhVUZ0jLe1qEsBkWGPBL6i8dW8UJigzFOTf6-M';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {

  // Middleware to connecting to Supabase APIs and fetching both users  and pagination information

  const { id, searchTerm, sortBy, order, offset, limit } = req.query;

  let urlWithParams = API_URL;
  let paginationInfoUrl = API_URL + '?select=id';
  let queryObject:any = {};

  if (id) {
    queryObject.id = `eq.${id}`
  }
  else {
    if (searchTerm) {
      const filterParam = `(name.ilike.*${searchTerm}*,email.ilike.*${searchTerm}*)`;
      queryObject.or= filterParam;
      paginationInfoUrl += '&or=' + filterParam
    }
    if (offset) queryObject = {...queryObject, offset}
    if (limit) queryObject = {...queryObject, limit}
    if (sortBy) {
      queryObject.order= `${sortBy}.${order}`
    }
  }

  const queryParams = new URLSearchParams(queryObject);
  urlWithParams += `?${queryParams.toString()}`;

  try {
    const response = await fetch(urlWithParams, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        apikey: API_KEY,
      },
    });

    const paginationInfo = await fetch(paginationInfoUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        apikey: API_KEY,
      },
    });
    // Supabase APIs dont give the pagination info so adding this call separately
    if (!response.ok) {
      const errorData = await response.json();
      return res.status(response.status).json({ error: errorData });
    }
    const data = await response.json();
    const paginationData = await paginationInfo.json();
    res.status(200).json({
      users: data,
      totalCount: paginationData.length
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error', details: error?.message });
  }
}