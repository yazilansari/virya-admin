import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import SafariPackageFrom from "@/components/FormElements/SafariPackageForm";

import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";

export const metadata: Metadata = {
  title: "Virya Edit Package",
  description:
    "Virya Edit Package",
};

const FormPage = ({ params }: { params: { id: string }}) => {
  const { id } = params; // Extract the id from params
  return (
    <DefaultLayout>
      <Breadcrumb pageName="Edit Safari Package" />

      <div className="flex flex-col gap-10">
       <SafariPackageFrom id={id}/>
      </div>
    </DefaultLayout>
  );
};

export default FormPage;
