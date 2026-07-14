import { findAllServices } from "../repositories/service.repository.js";

export async function getAvailableServices() {
  return findAllServices();
}