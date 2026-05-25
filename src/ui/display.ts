import type {
  AbilityKey,
  CareerCategory,
  EducationLevel,
  EventDefinition,
  LifePhase,
  OrganizationKind,
  Region,
  SocialClass,
} from "../types/game";

export const lifePhaseLabels: Record<LifePhase, string> = {
  childhood: "幼年期",
  youth: "少年期",
  youngAdulthood: "青年期",
  adulthood: "壮年期",
  oldAge: "老年期",
};

export const abilityLabels: Record<AbilityKey, string> = {
  body: "身体",
  mind: "知性",
  craft: "技能",
  social: "社交",
  spirit: "精神",
};

export const educationLevelLabels: Record<EducationLevel, string> = {
  none: "未就学",
  primary: "初等教育",
  secondary: "中等教育",
  vocational: "専門教育",
  higher: "高等教育",
  nightSchool: "夜学",
};

export const careerCategoryLabels: Record<CareerCategory, string> = {
  none: "なし",
  labor: "労働",
  clerical: "事務",
  academic: "学術",
  religious: "宗教",
  state: "官吏",
  underground: "地下活動",
  mercantile: "商業",
};

export const classLabels: Record<SocialClass, string> = {
  lower: "下層",
  worker: "労働者",
  middle: "中流",
  upper: "上流",
  special: "特別階級",
};

export const regionLabels: Record<Region, string> = {
  capital: "首都",
  industrial: "工業地区",
  academic: "学術地区",
  religious: "宗教都市",
  frontier: "辺境",
};

export const organizationKindLabels: Record<OrganizationKind, string> = {
  state: "国家機関",
  corporation: "企業",
  academia: "学術機関",
  religion: "宗教組織",
  underground: "地下組織",
};

export const roleLabels: Record<string, string> = {
  sibling: "きょうだい",
  neighbor: "隣人",
  mentor: "導き手",
};

export const categoryLabels: Record<EventDefinition["category"], string> = {
  daily: "日常",
  relationship: "関係",
  turningPoint: "転機",
  world: "世界",
};

export function formatMonthsAsAge(ageMonths: number): string {
  const years = Math.floor(ageMonths / 12);
  const months = ageMonths % 12;

  if (months === 0) return `${years}歳`;
  return `${years}歳${months}か月`;
}
