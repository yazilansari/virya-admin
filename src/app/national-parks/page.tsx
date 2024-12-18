import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import NationalParkTable from "@/components/Tables/NationalParkTable";

import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";

export const metadata: Metadata = {
  title: "Virya List Parks",
  description:
    "Virya List Parks",
};

const TablesPage = () => {
  return (
    <DefaultLayout>
      <Breadcrumb pageName="List National Parks" />

      <div className="flex flex-col gap-10">
        <NationalParkTable />
      </div>
    </DefaultLayout>
  );
};

export default TablesPage;
