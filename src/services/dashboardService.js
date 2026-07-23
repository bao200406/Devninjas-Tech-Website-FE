import api from "../axios/api.js";
import { format } from "date-fns";

// Lấy dữ liệu thống kê tổng quan (các con số: totalRevenue, totalOrders,...)
export const getDashboardStats = async (days, startDate = null, endDate = null) => {
  let url = `/dashboard/stats?days=${days}`;
  
  if (days === "custom" && startDate && endDate) {
    const startStr = format(startDate, "yyyy-MM-dd");
    const endStr = format(endDate, "yyyy-MM-dd");
    url = `/dashboard/stats?days=custom&startDate=${startStr}&endDate=${endStr}`;
  }
  
  const response = await api.get(url);
  return response.data;
};

// Lấy dữ liệu cho biểu đồ (Revenue, Orders, AOV theo ngày)
export const getChartData = async (days, startDate = null, endDate = null) => {
  let url = `/dashboard/chart?days=${days}`;
  
  if (days === "custom" && startDate && endDate) {
    const startStr = format(startDate, "yyyy-MM-dd");
    const endStr = format(endDate, "yyyy-MM-dd");
    url = `/dashboard/chart?days=custom&startDate=${startStr}&endDate=${endStr}`;
  }
  
  const response = await api.get(url);
  return response.data;
};

export const getCategoryStats = async (days, startDate = null, endDate = null) => {
  let url = `/dashboard/category-stats?days=${days}`;
  
  if (days === "custom" && startDate && endDate) {
    const startStr = format(startDate, "yyyy-MM-dd");
    const endStr = format(endDate, "yyyy-MM-dd");
    url = `/dashboard/category-stats?days=custom&startDate=${startStr}&endDate=${endStr}`;
  }
  
  const response = await api.get(url);
  return response.data;
};