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
    // We need to get the users and paginationInfo through 2 separate Supabase URLs, adding both of them in a promise array belowl
    const apiCalls = [
      fetch(urlWithParams, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          apikey: API_KEY,
        },
      }),
      fetch(paginationInfoUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          apikey: API_KEY,
        },
      })      
    ];

    let [ usersData, pagingData ] = await Promise.allSettled(apiCalls);
    let [ users, totalCount ] = [ [], 0];
    if (usersData.status == 'fulfilled') {
      users = await usersData.value.json();
    }
    if (pagingData.status == 'fulfilled') {
      totalCount = (await pagingData.value.json()).length;
    } else totalCount = users.length;

    res.status(200).json({ users, totalCount });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error', details: error?.message });
  }
}