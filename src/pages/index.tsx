import type { ReactNode } from "react";
import Layout from "@theme/Layout";

import HomePageSkills from "../components/HomepageSkills";
import HomepageBanner from "../components/HomepageBanner";
import HomepageProjects from "../components/HomepageProjects";

export default function Home(): ReactNode {
  return (
    <Layout>
      <HomepageBanner />
      <main>
        <HomePageSkills />
        <HomepageProjects />
      </main>
    </Layout>
  );
}
