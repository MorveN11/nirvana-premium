import { Job, Modality, Schedule } from "@/features/jobs/lib/constants";
import { apiRequest } from "@/lib/api";
import { notFound } from "next/navigation";

interface JobsResponse {
  items: Job[];
  page: number;
  pageSize: number;
  totalCount: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

interface FilterParams {
  search?: string;
  modality?: string;
  schedule?: string;
  minSalary?: string;
  page?: string;
  pageSize?: string;
}

function normalizeModality(modality: string): string {
  switch (modality.toLowerCase()) {
    case "onsite":
    case "on-site":
    case "on site":
      return "OnSite";
    case "remote":
      return "Remote";
    case "hybrid":
      return "Hybrid";
    default:
      return modality;
  }
}

function normalizeSchedule(schedule: string): string {
  switch (schedule.toLowerCase()) {
    case "fulltime":
    case "full-time":
    case "full time":
      return "FullTime";
    case "parttime":
    case "part-time":
    case "part time":
      return "PartTime";
    default:
      return schedule;
  }
}

function filterJobs(jobs: Job[], filters: FilterParams): Job[] {
  return jobs.filter((job) => {
    // Search filter
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      const matchesTitle = job.title.toLowerCase().includes(searchTerm);
      const matchesDescription = job.description
        .toLowerCase()
        .includes(searchTerm);
      if (!matchesTitle && !matchesDescription) {
        return false;
      }
    }

    // Modality filter
    if (filters.modality && filters.modality !== "all") {
      const normalizedFilterModality = normalizeModality(filters.modality);
      const normalizedJobModality = normalizeModality(job.modality);
      if (normalizedFilterModality !== normalizedJobModality) {
        return false;
      }
    }

    // Schedule filter
    if (filters.schedule && filters.schedule !== "all") {
      const normalizedFilterSchedule = normalizeSchedule(filters.schedule);
      const normalizedJobSchedule = normalizeSchedule(job.schedule);
      if (normalizedFilterSchedule !== normalizedJobSchedule) {
        return false;
      }
    }

    // Minimum salary filter
    if (filters.minSalary && filters.minSalary !== "") {
      const minSalary = parseFloat(filters.minSalary);
      if (!isNaN(minSalary) && job.salaryPerHour < minSalary) {
        return false;
      }
    }

    return true;
  });
}

export async function readJobs(
  searchParams: FilterParams = {},
  page: number = 1,
  pageSize: number = 10,
): Promise<{
  jobs: Job[];
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  page: number;
  totalCount: number;
}> {
  try {
    console.log("Fetching jobs with params:", searchParams);

    const response = await apiRequest<JobsResponse>({
      endpoint: "/users-jobs/jobs",
      method: "GET",
      revalidate: 3600,
    });

    // Apply client-side filtering
    const filteredJobs = filterJobs(response.items, searchParams);

    // Calculate pagination
    const totalCount = filteredJobs.length;
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedJobs = filteredJobs.slice(startIndex, endIndex);
    const totalPages = Math.ceil(totalCount / pageSize);

    console.log("Filtered jobs count:", filteredJobs.length);
    console.log("Current page:", page);
    console.log("Total pages:", totalPages);

    return {
      jobs: paginatedJobs,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
      page,
      totalCount,
    };
  } catch (error) {
    console.error("❌ Error fetching jobs:", error);
    return {
      jobs: [],
      hasNextPage: false,
      hasPreviousPage: false,
      page: 1,
      totalCount: 0,
    };
  }
}

export async function getJobById(id: string): Promise<Job> {
  try {
    const job = await apiRequest<Job>({
      endpoint: `/users-jobs/jobs/${id}`,
      method: "GET",
      revalidate: 3600,
    });

    if (!job) {
      throw new Error("Job not found");
    }

    return job;
  } catch (error) {
    console.error(`❌ Error fetching job ${id}:`, error);
    notFound();
  }
}
