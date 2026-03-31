import { getSite } from "@/lib/site";

export const schoolPlanningGuideHref = "/schools";
export const schoolPlanningGuideLabel = "School planning guide";
export const schoolPlanningGuideActionLabel = "Open school planning guide";

export function getOfficialEmpathySchoolUrl() {
  return getSite().brand.publisherUrl;
}
