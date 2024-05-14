"use client";
import FormHeader from "@/components/backoffice/FormHeader";
import ImageInput from "@/components/forminputs/ImageInput";
import SubmitButton from "@/components/forminputs/SubmitButton";
import TextareaInput from "@/components/forminputs/TextAreaInput";
import TextInput from "@/components/forminputs/TextInput";
import { makePostRequest } from "@/lib/apiRequest";
import { generateSlug } from "@/lib/generateSlug";
import React, { useState } from "react";
import { useForm } from "react-hook-form";

export default function NewCategory() {
  const [imageUrl, setImageUrl] = useState();
  const [imageFile, setImageFile] = useState();
  const [loading, setLoading] = useState(false);

  const onFileChange = (file) => {
    setImageFile(file);
    console.log(file);
  };

  const {
    register,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm();

  async function onSubmit(data) {
    setLoading(true);

    const formData = new FormData();
    console.log(data.categoryimage[0]);
    formData.append("categoryimage", data.categoryimage[0]);
    formData.append("filename", "categoryimage");
    formData.append("folder", "categoryimage");

    try {
      const response = await fetch("/api/uploadimage", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const responseData = await response.json();
        console.log("Image uploaded successfully!");
        const slug = generateSlug(data.title);
        data.slug = slug;
        data.imageUrl = responseData.imageUrl;
        console.log(data.imageUrl);
        makePostRequest(setLoading, "api/categories", data, "Category", reset);
        setImageUrl("");
      } else {
        alert("Failed to upload image.");
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("An error occurred while uploading image.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <FormHeader title={"New Category"} />
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-4xl p-4 bg-white border border-gray-200 rounded-lg shadow sm:p-6 md:p-8 dark:bg-gray-800 dark:border-gray-700 mx-auto my-3"
        method="post"
        encType="multipart/form-data"
      >
        <div className="grid gap-4 sm:grid-cols-2 sm:gap-6">
          <TextInput
            label={"Category Title"}
            name={"title"}
            reset={reset}
            register={register}
            errors={errors}
          />
          <TextareaInput
            label={"Category Description"}
            name={"description"}
            reset={reset}
            register={register}
            errors={errors}
          />
          <ImageInput
            label={"Category Image"}
            name={"categoryimage"}
            reset={reset}
            register={register}
            errors={errors}
            onFileChange={onFileChange}
          />
        </div>
        <SubmitButton
          isLoading={loading}
          buttonTitle={"Create Category"}
          loadingButtonTitle={"Creating Category please wait..."}
        />
      </form>
    </div>
  );
}
