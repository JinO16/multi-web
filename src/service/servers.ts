import service from '@src/service/axios';
import API from '@src/service/api';

export const getService = async (params:any) => {
  return await service.post<any, any>(API.SERVICE, params);
};