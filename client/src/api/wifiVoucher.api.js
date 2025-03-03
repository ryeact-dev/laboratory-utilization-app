import axios from 'axios';

// GET LIST OF ALL LABORATORY VOUCHERS
export async function getLaboratoryWifiVouchers({ laboratory }) {
  // await new Promise((resolve) => setTimeout(resolve, 500)); // Delay of 500 milliseconds
  return await axios.post('/api/wifi-vouchers', { laboratory });
}
// GET SINGLE LABORATORY VOUCHER
export async function getSingleLabWifiVoucher({ laboratory }) {
  // await new Promise((resolve) => setTimeout(resolve, 500)); // Delay of 500 milliseconds
  return await axios.get(`/api/lab-wifi-voucher?laboratory=${laboratory}`);
}
export async function addLaboratoryWifiVoucher({ forAddingData }) {
  // await new Promise((resolve) => setTimeout(resolve, 500)); // Delay of 500 milliseconds
  return await axios.patch('/api/update-wifi-vouchers', { forAddingData });
}
