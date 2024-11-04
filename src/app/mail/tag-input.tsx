"use client";

import Avatar from "react-avatar";
import Select, { type GroupBase, type OptionsOrGroups } from "react-select";
import { useThreads } from "@/hooks/use-threads";
import { useState } from "react";
import { api } from "@/trpc/react";
import { type Value } from "@/types";

interface Props {
  placeholder: string;
  label: string;
  onChange: (values: Value[]) => void;
  value: Value[];
}

export const TagInput = ({ placeholder, label, onChange, value }: Props) => {
  const { accountId } = useThreads();
  const { data: suggestions } = api.account.getSuggestions.useQuery({
    accountId,
  });
  const [inputValue, setInputValue] = useState("");

  const options = suggestions?.map((suggestion) => ({
    label: (
      <span className="flex items-center gap-2">
        <Avatar name={suggestion.address} size="25" textSizeRatio={2} round />
        {suggestion.address}
      </span>
    ),
    value: suggestion.address,
  })) as OptionsOrGroups<Value, GroupBase<Value>> | undefined;

  return (
    <div className="flex items-center rounded-md border">
      <span className="ml-3 text-sm text-gray-500">{label}</span>

      <Select
        value={value}
        onChange={(values) => onChange(values as Value[])}
        onInputChange={setInputValue}
        placeholder={placeholder}
        options={
          inputValue
            ? options?.concat({ label: inputValue, value: inputValue })
            : options
        }
        isMulti
        className="w-full flex-1"
        classNames={{
          control: () =>
            "!border-none !outline-none !ring-0 !shadow-none focus:border-none focus:outline-none focus:ring-0 focus:shadow-none dark:bg-transparent",
          multiValue: () => "dark:!bg-gray-700",
          multiValueLabel: () => "dark:text-white dark:bg-gray-700 rounded-md",
        }}
      />
    </div>
  );
};
