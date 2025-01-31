"use client";
import React, { useEffect } from "react";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { bankAccountSchema } from "@/lib/Schema";
import { CalendarIcon, CheckCheck, Landmark, Loader, Plus } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Switch } from "@/components/ui/switch";
import { addBankAccount } from "@/actions/bankAccount";
import useFetch from "@/hooks/use-Fetch";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const AddBankAccount = ({ children, setRevalidatePage }) => {
  const [open, setOpen] = React.useState(false);
  const [editMode, setEditMode] = React.useState(false);
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(bankAccountSchema),
    defaultValues: {
      bankName: "",
      date: "",
      openingBalance: "",
      isDefault: false,
    },
  });

  const date = watch("date");
  const isDefault = watch("isDefault");

  // Create bank function
  const {
    apiFun: createBankFn,
    apiRes: createBankRes,
    loading: createBankLoading,
    error: createBankError,
  } = useFetch(addBankAccount);

  const onSubmit = async (data) => {
    await createBankFn(data);
  };

  const handleReset = () => {
    reset();
    setOpen(false);
    setEditMode(false);
  };

  useEffect(() => {
    if (createBankError) {
      toast.error(createBankError.message);
    }
  }, [createBankError]);

  useEffect(() => {
    if (createBankRes && createBankRes.success) {
      handleReset();
      toast.success("Bank added successfully.");
      setRevalidatePage(true);
    } else if (createBankRes && !createBankRes.success) {
      toast.error(createBankRes.message);
    }
  }, [createBankRes]);

  return (
    <div>
      <Drawer
        open={open}
        onOpenChange={(isOpen) => {
          setOpen(isOpen);
          if (!isOpen) {
            handleReset();
          }
        }}
      >
        <DrawerTrigger asChild>{children}</DrawerTrigger>
        <DrawerContent className="flex sm:w-[500px] md:w-[700px] lg:w-[900px] container mx-auto md:p-4 pb-1 md:pb-10">
          <DrawerHeader>
            <DrawerTitle className="gradient-subTitle flex justify-center items-center gradient-subTitle text-3xl space-x-3">
              <span className="bg-blue-100 rounded-full p-2 shadow-lg">
                <Landmark color="black" size={25} />
              </span>
              <span>Bank</span>
            </DrawerTitle>
            <DrawerDescription>
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="flex items-center flex-wrap space-y-3 pb-3 pt-3 md:pt-0">
                  <Label
                    htmlFor="bankName"
                    className="text-base md:text-base text-start md:w-1/3"
                  >
                    Enter Bank Name :-
                  </Label>
                  <div className="space-y-1 space-x-2">
                    <Input
                      {...register("bankName")}
                      placeholder="Ex. State Bank Of India."
                      id="bankName"
                      name="bankName"
                      className="w-[280px] text-black text-base md:text-sm"
                    />
                    {errors.bankName && (
                      <p className="text-red-600 text-sm">
                        {errors.bankName.message}
                      </p>
                    )}
                  </div>
                </div>

                {/* Account opening balance */}
                <div className="opening-balance flex items-center flex-wrap space-y-3 pb-3 pt-3 md:pt-0">
                  <Label
                    htmlFor="openingBalance"
                    className="text-base md:w-1/3"
                  >
                    Account Opening Balance :-
                  </Label>
                  <div className="space-y-1 space-x-2">
                    <Input
                      {...register("openingBalance")}
                      type="number"
                      step="0.01"
                      className="w-[280px] text-black text-sm md:text-base"
                      placeholder="Ex. 1000.00/-"
                    />
                    {errors.openingBalance && (
                      <p className="text-red-600 text-sm">
                        {errors.openingBalance.message}
                      </p>
                    )}
                  </div>
                </div>

                {/* Date of account opening */}
                <div className="bank-acc-date flex items-center flex-wrap space-y-3 pb-3 pt-3 md:pt-0">
                  <Label htmlFor="date" className="text-base md:w-1/3">
                    Date of Account Opening :-
                  </Label>
                  <div className="space-y-1 space-x-2">
                    <Popover className="w-1/3">
                      <PopoverTrigger asChild>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-[280px] pl-3 text-left font-normal",
                            !date && "text-muted-foreground"
                          )}
                        >
                          {date ? (
                            format(date, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-[280px] space-x-3 md:space-x-0">
                        <Calendar
                          mode="single"
                          selected={date}
                          onSelect={(date) => setValue("date", date)}
                          disabled={(date) =>
                            date > new Date() || date < new Date("1900-01-01")
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>

                    {errors.date && (
                      <p className="text-red-600 text-sm">
                        {errors.date.message}
                      </p>
                    )}
                  </div>
                </div>

                {/* Default account */}
                <div className="flex flex-row items-center justify-between rounded-lg border p-4 md:w-2/3">
                  <div className="flex flex-col items-start space-y-0.5">
                    <label className="text-base font-medium">
                      Is this default account
                    </label>
                    <div className="text-sm text-muted-foreground text-start">
                      Set this account as a default account for transaction.
                    </div>
                  </div>

                  <Switch
                    checked={isDefault}
                    onCheckedChange={(checked) =>
                      setValue("isDefault", checked)
                    }
                  />
                </div>
                {/* Submit buttons */}
                <div className="flex items-center space-x-3 my-3 pb-6">
                  <Button type="submit" size="default" variant="default">
                    {editMode ? (
                      createBankLoading ? (
                        <>
                          <Loader /> Updating Bank...
                        </>
                      ) : (
                        <>
                          <Plus size={35} />
                          Edit Bank
                        </>
                      )
                    ) : createBankLoading ? (
                      <>
                        <Loader /> Adding Bank...
                      </>
                    ) : (
                      <>
                        <Plus size={35} />
                        Add Bank
                      </>
                    )}
                  </Button>

                  <Button
                    type="button"
                    size="default"
                    variant="default"
                    onClick={() => handleReset()}
                  >
                    Cancel
                  </Button>
                </div>
              </form>

              {/* Info Section */}
              <section>
                <p className="pb-4 flex items-center space-x-1">
                  <span className="bg-green-100 rounded-full p-2 shadow-lg">
                    <CheckCheck color="green" />
                  </span>
                  <span>Add as many bank as you want.</span>
                </p>
                <p className="pb-4 flex items-center space-x-2">
                  <span className="bg-green-100 rounded-full p-2 shadow-lg">
                    <CheckCheck color="green" />
                  </span>
                  <span>Add 1 bank at a time.</span>
                </p>
                <p className="pb-4 hidden md:flex items-center space-x-2  ">
                  <span className="bg-green-100 rounded-full p-2 shadow-lg">
                    <CheckCheck color="green" />
                  </span>
                  <span>You can edit any bank later.</span>
                </p>
              </section>
            </DrawerDescription>
          </DrawerHeader>
        </DrawerContent>
      </Drawer>
    </div>
  );
};

export default AddBankAccount;
