import { apiGet } from "@/lib/api";

export async function getCustomerHomeDateOverview() {
  return apiGet("/customer/home");
}