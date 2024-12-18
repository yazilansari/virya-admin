import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import NationalParkForm from "@/components/FormElements/NationalParkForm";

import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";

export const metadata: Metadata = {
  title: "Virya Add Park",
  description:
    "Virya Add Park",
};

const FormPage = () => {
  return (
    <DefaultLayout>
      <Breadcrumb pageName="Add National Park" />

      <div className="flex flex-col gap-10">
       <NationalParkForm />
      </div>
    </DefaultLayout>
  );
};

export default FormPage;
