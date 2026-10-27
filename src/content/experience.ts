export type Role = {
  title: string;
  company: string;
  location: string;
  start: string;
  end: string | null;
  highlights: string[];
  stack: string[];
};

// Wording follows the CV so the site and the CV never disagree.
export const experience: Role[] = [
  {
    title: "Senior Software Engineer",
    company: "TENDERD",
    location: "Dubai, UAE",
    start: "Jun 2023",
    end: null,
    highlights: [
      "Lead frontend architecture for an AI-powered equipment and fleet management SaaS used by enterprise customers managing thousands of assets.",
      "Lead a team of 3 frontend engineers: technical direction, code review and hiring interviews.",
      "Worked on the move to single-spa micro-frontends so product modules can be developed and released independently.",
      "Reworked rendering and state management on real-time dashboards for about 40% faster load times.",
    ],
    stack: [
      "React",
      "Next.js",
      "TypeScript",
      "single-spa",
      "Node.js",
      "Laravel",
      "AWS",
    ],
  },
  {
    title: "Full Stack Developer, Team Lead",
    company: "TNC IT Solutions Group",
    location: "Dubai, UAE",
    start: "Oct 2021",
    end: "Jun 2023",
    highlights: [
      "Led the team behind Real Research, a survey app with 1M+ downloads on iOS and Android, and a set of crypto wallet apps.",
      "Built Node.js and NestJS services on MongoDB, Redis and Docker for 100K+ daily active users.",
      "Led the conversion of a native Kotlin and Swift app to React Native, improving performance by about 35%.",
      "Worked on site in Seoul, South Korea, on an AI research and development initiative, mentoring 5+ junior developers.",
    ],
    stack: ["React", "Next.js", "NestJS", "MongoDB", "Redis", "React Native"],
  },
  {
    title: "Full Stack Developer",
    company: "HousekeepingCo. Tadbeer",
    location: "Dubai, UAE",
    start: "Aug 2018",
    end: "Oct 2021",
    highlights: [
      "Led frontend development of an enterprise platform for hiring domestic workers, serving 100K+ active users across several countries.",
      "Built 30+ modules for CRM, call center, HRM, ERP and ticketing systems from a shared component set.",
    ],
    stack: [
      "React",
      "Redux",
      "Material UI",
      "Ant Design",
      "Node.js",
      "Laravel",
    ],
  },
  {
    title: "Web Developer",
    company: "LAMPDO",
    location: "Faisalabad, Pakistan",
    start: "May 2016",
    end: "Jul 2018",
    highlights: [
      "Built full-stack web applications in Laravel, CodeIgniter and WordPress for 50K+ monthly active users.",
      "Moved slow work to queued background jobs, cutting request latency by about 40%.",
    ],
    stack: ["PHP", "Laravel", "CodeIgniter", "MySQL", "WordPress"],
  },
];

export function formatPeriod(role: Pick<Role, "start" | "end">): string {
  return `${role.start} – ${role.end ?? "Present"}`;
}
