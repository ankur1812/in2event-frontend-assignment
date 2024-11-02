import React, { ReactHTMLElement } from "react";
import { User } from "@/schemas/user";
import { EnvelopeClosedIcon, MobileIcon, GlobeIcon, DrawingPinFilledIcon, HomeIcon, IdCardIcon, BackpackIcon, ChatBubbleIcon, MagicWandIcon } from "@radix-ui/react-icons"
  
interface UserInfoProps {
  user: User;
}

interface InfoRowItem {
  icon?: string | null;
  href?: string;
  label?: string;
  newTab?: boolean;
  value: string | number | undefined;
  // innerHTML?: string;
}

const UserInfo: React.FC<UserInfoProps> = ({ user }) => {
  const iconMap:any = {
    EnvelopeClosedIcon, MobileIcon, GlobeIcon, DrawingPinFilledIcon, HomeIcon, IdCardIcon, BackpackIcon, ChatBubbleIcon, MagicWandIcon
  }

  const websiteUrl = (url:string | undefined) => !url ? "" : url.startsWith('https://') ? url : 'https://' + url;
  
  const getFullAddress = (address: User['address']) => {
    if (!address) return null;
    let { suite, street, city, zipcode } = address!;
    let fullAddress = suite;
    if (street) fullAddress += ', ' + street;
    if (city) fullAddress += ', ' + city;
    if (zipcode) fullAddress += ', ' + zipcode;
    return fullAddress;
  }
  const fullAddress = getFullAddress(user.address);
  const hasGeoInfo = user.address?.geo?.lat && user.address?.geo?.lng;

  const infoRow = (items: InfoRowItem[], rowLabel?: string) => {
    return (
      <>
        <label className="text-muted-foreground ">{rowLabel}</label>
        <div className="flex flex-wrap gap-x-6 gap-y-4 w-full my-3">
        {items.map( (item:InfoRowItem) => {
          const Icon = iconMap[item.icon!];
          if(!item.value) return null;
          return (
            <div className="flex flex-col gap-1">
              <span className="text-xs text-muted-fore2ground"> {item.label} </span>
              <div className="flex gap-2 items-center">
                {Icon ? <Icon /> : '#'}
                <span>
                  {item.href ? <a href={item.href} target={item.newTab ? "_blank" : "_self"}> {item.value} </a> : <span> {item.value} </span>}
                  {/* {item.innerHTML && <div dangerouslySetInnerHTML={{ __html: item.innerHTML}} />} */} 
                </span>
              </div>
            </div>    
            )}
          )}
        </div>
      </>
    );
  }

  return (
    <div className="flex flex-col gap-1 w-full">
      {infoRow(
        [
          {icon: null, label: 'User ID', value: user.id},
          {icon: 'IdCardIcon', label: 'Username', value: user.username},
        ]
      )}
      {infoRow(
        [
          {icon: 'MobileIcon', label: 'Phone', value: user.phone, href:`tel:${user.phone}`},
          {icon: 'EnvelopeClosedIcon', label: 'Email', value: user.email, href:`mailto:${user.email}`},
          {icon: 'GlobeIcon', label: 'Website', value: user.website, href:websiteUrl(user.website), newTab: true},
        ], 'Contact details'
      )}
      {fullAddress && infoRow(
        [{
          icon: hasGeoInfo ? 'DrawingPinFilledIcon' : 'HomeIcon',
          label: 'Address',
          value: fullAddress,
          newTab: !!hasGeoInfo,
          href: hasGeoInfo ? `https://www.google.com/maps?q=${user.address.geo.lat},${user.address.geo.lng}`: ""
      }],
      'Address'
    )}

      {user.company && infoRow(
        [
          {icon: 'BackpackIcon', label: 'Company name', value: user.company.name},
          {icon: 'MagicWandIcon', label: 'BS', value: user.company.bs},
          {icon: 'ChatBubbleIcon', label: 'Catch phrase', value: user.company.catchPhrase}
        ],
        'Company details'
      )}
    </div>
  );
};

export { UserInfo };
