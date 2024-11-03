import React from "react";
import { User, UserSchema } from "@/schemas/user";
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { PersonIcon, EnvelopeClosedIcon, MobileIcon, GlobeIcon, HomeIcon, IdCardIcon, BackpackIcon, ChatBubbleIcon, MagicWandIcon } from "@radix-ui/react-icons"
import { cn } from "@/lib/utils";
  
interface NewUserFromProps {
  onSave: (user: User) => void;
}

const NewUserForm: React.FC<NewUserFromProps> = ({ onSave }) => {

    const { register, handleSubmit, formState: { errors }, setError, clearErrors } = useForm();
    const onSubmit = (data: any) => {
      let { companyName, catchPhrase, bs, suite, street, city, zipcode, ...userData } = data;
      if (suite || street || city || zipcode) {
        let address = { suite, street, city, zipcode }
        userData = { ...userData, address };
      }
      if (companyName || catchPhrase || bs) {
        let company = { name: companyName, catchPhrase, bs };
        userData = { ...userData, company };
      }
      clearErrors();
      try {
        UserSchema.parse(userData);
        onSave(userData);
      } catch (error) {
        if (error instanceof z.ZodError) {
          console.log(error.errors)
          error.errors.forEach(({ path, message }) => {
            setError(path[0], { message });
          });
        }
      }
    };
    const iconMap:any = {
      PersonIcon, EnvelopeClosedIcon, MobileIcon, GlobeIcon, HomeIcon, IdCardIcon, BackpackIcon, MagicWandIcon, ChatBubbleIcon
    }
  

    const inputField = (fieldname: string, label?: string, icon?: string,  required?: boolean) => {
      const errorMsg = errors && errors[fieldname] ? errors[fieldname].message : "";
      const Icon = iconMap[icon];
      return (
        <div className="flex flex-col items-center md:items-auto w-full md:w-1/2">
          <div className="flex flex-wrap gap-x-2 gap-y-0">
            <span className="flex gap-2 items-center">
              { Icon && <Icon />}
              <label className="capitalize min-w-24" htmlFor="name">{label || fieldname} <sup>{ required ? '*' : ''}</sup></label>
            </span>
            <div className="flex flex-col gap-1">
              <input
                id={fieldname}
                className={cn("bg-inherit border-b border-white focus:outline-none focus:shadow-none2", {"border-red-400" : !!errorMsg})}
                {...register(`${fieldname}`)}
              />
              <span className="block text-destructive text-xs ">{errorMsg}</span>
            </div>
          </div>
        </div>
      );
    }

    return (
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* <label className="text-lg my-2">Personal Info</label> */}
        <div className="flex flex-wrap mt-2">
        { inputField('name', 'Name', 'PersonIcon', true) }
        { inputField('username', 'Username', 'IdCardIcon', true) }
        </div>
        <div className="flex flex-wrap mt-2">
        { inputField('email', 'Email', 'EnvelopeClosedIcon', true) }
        { inputField('phone', 'Phone', 'MobileIcon', true) }
        </div>
        <div className="flex flex-wrap mt-2">
        { inputField('website', 'Website', 'GlobeIcon') }
        </div>
        <label className="flex text-md mt-6 text-muted-foreground">User Address</label>
        <div className="flex flex-wrap mt-2">
        { inputField('suite', 'Suite', 'HomeIcon') }
        { inputField('street') }
        </div>
        <div className="flex flex-wrap mt-2">
        { inputField('city') }
        { inputField('zipcode') }
        </div>
        <label className="flex text-md mt-6 text-muted-foreground">Add Company details</label>
        <div className="flex flex-wrap mt-2">
        { inputField('companyName', 'Name', 'BackpackIcon') }
        { inputField('bs', 'Bs', 'MagicWandIcon') }
        { inputField('catchPhrase', 'Catch phrase', 'ChatBubbleIcon') }
        </div>
        <button type="submit" className="w-full mt-16 p-2 bg-white text-black border border-transparent hover:bg-inherit hover:text-inherit hover:border-white focus:bg-inherit focus:text-inherit">Save User</button>
      </form>
    );
};

export { NewUserForm };
