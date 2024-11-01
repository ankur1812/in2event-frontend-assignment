import React from "react";
import { User, UserSchema } from "@/schemas/user";
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { PersonIcon, EnvelopeClosedIcon, MobileIcon, GlobeIcon, HomeIcon, IdCardIcon, BackpackIcon } from "@radix-ui/react-icons"
  
interface NewUserFromProps {
  onSave: (user: User) => void;
}

const NewUserForm: React.FC<NewUserFromProps> = ({ onSave }) => {

    const { register, handleSubmit, formState: { errors }, setError, clearErrors } = useForm();
    const onSubmit = (data: any) => {
      let { companyName, catchPhrase, suite, street, city, zipcode, ...userData } = data;
      let address = { suite, street, city, zipcode }
      let company = { name: companyName, catchPhrase: data.catchPhrase };
      userData = { ...userData, address, company };
      // console.log(userData);
      clearErrors();
      try {
        UserSchema.parse(data);
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
      PersonIcon, EnvelopeClosedIcon, MobileIcon, GlobeIcon, HomeIcon, IdCardIcon, BackpackIcon
    }
  

    const inputField = (fieldname: string, label?: string, icon?: string,  required?: boolean) => {
      const errorMsg = errors && errors[fieldname] ? errors[fieldname].message : "";
      const Icon = iconMap[icon];
      return (
        <div className="flex flex-col items-center md:items-auto w-full md:w-1/2">
          <div className="flex flex-wrap">
            <span className="flex gap-2 items-center">
              { Icon && <Icon />}
              <label className="capitalize min-w-24" htmlFor="name">{label || fieldname} <sup>{ required ? '*' : ''}</sup></label>
            </span>
            <input
              id={fieldname}
              className="bg-inherit border-b border-white focus:outline-none focus:shadow-none2"
              {...register(`${fieldname}`)}
            />
          </div>
          <span className="block text-red-500 text-sm ml-24 h-10">{errorMsg}</span>
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
        <span className="flex gap-2 items-center justify-center md:justify-normal">
          <GlobeIcon />
          <label className="text-md my-2">Address</label>
        </span>
        <div className="flex flex-wrap mt-2">
        { inputField('suite') }
        { inputField('street') }
        </div>
        <div className="flex flex-wrap mt-2">
        { inputField('city') }
        { inputField('zipcode') }
        </div>
        <span className="flex gap-2 items-center justify-center md:justify-normal">
          <BackpackIcon />
          <label className="text-md my-2">Company</label>
        </span>
        <div className="flex flex-wrap mt-2">
        { inputField('companyName', "Name") }
        { inputField('catchPhrase', "Slogan") }
        </div>
        <button type="submit" className="w-full mt-4 p-2 bg-white text-black border border-transparent hover:bg-inherit hover:text-inherit hover:border-white">Save User</button>
      </form>
    );
};

export { NewUserForm };
