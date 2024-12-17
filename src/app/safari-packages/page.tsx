import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import SafariPackageTable from "@/components/Tables/SafariPackageTable";

import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";

export const metadata: Metadata = {
  title: "Virya List Packages",
  description:
    "Virya List Packages",
};

const TablesPage = () => {
  return (
    <DefaultLayout>
      <Breadcrumb pageName="List Safari Packages" />

      <div className="flex flex-col gap-10">
        <SafariPackageTable />
      </div>
    </DefaultLayout>
  );
};

export default TablesPage;
