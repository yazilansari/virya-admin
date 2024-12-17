import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import SafariPackageFrom from "@/components/FormElements/SafariPackageForm";

import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";

export const metadata: Metadata = {
  title: "Virya Add Package",
  description:
    "Virya Add Package",
};

const FormPage = () => {
  return (
    <DefaultLayout>
      <Breadcrumb pageName="Add Safari Package" />

      <div className="flex flex-col gap-10">
       <SafariPackageFrom />
      </div>
    </DefaultLayout>
  );
};

export default FormPage;
