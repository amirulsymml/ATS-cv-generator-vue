export interface Job {
  title: string;
  company: string;
  location: string;
  from: string;
  to: string;
  bullets: string[];
}

export interface Education {
  degree: string;
  school: string;
  location: string;
  from: string;
  to: string;
}

export interface Skill {
  label: string;
  values: string;
}

export interface Referee {
  name: string;
  phone: string;
  role: string;
}

export interface CVData {
  name: string;
  phone: string;
  email: string;
  city: string;
  linkedin: string;
  summary: string;
  jobs: Job[];
  educations: Education[];
  skills: Skill[];
  certifications: string[];
  referees: Referee[];
}

// ─── Default Values ───────────────────────────────────────────────────────────

export function defaultJob(): Job {
  return {
    title: "",
    company: "",
    location: "",
    from: "",
    to: "",
    bullets: ["", ""],
  };
}

export function defaultEducation(): Education {
  return { degree: "", school: "", location: "", from: "", to: "" };
}

export function defaultSkill(): Skill {
  return { label: "", values: "" };
}

export function defaultReferee(): Referee {
  return { name: "", phone: "", role: "" };
}

export function defaultCVData(): CVData {
  return {
    name: "",
    phone: "",
    email: "",
    city: "",
    linkedin: "",
    summary: "",
    jobs: [defaultJob()],
    educations: [defaultEducation()],
    skills: [defaultSkill()],
    certifications: [""],
    referees: [defaultReferee(), defaultReferee()],
  };
}
