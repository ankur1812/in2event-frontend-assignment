import React, { ReactHTMLElement } from "react";
import { User } from "@/schemas/user";
import { EnvelopeClosedIcon, MobileIcon, GlobeIcon, DrawingPinFilledIcon, HomeIcon, IdCardIcon, BackpackIcon } from "@radix-ui/react-icons"
  
interface UserInfoProps {
  user: User;
}

interface InfoRowItem {
  icon?: string | null;
  href?: string;
  newTab?: boolean;
  value: string | number | undefined;
  // innerHTML?: string;
}

const UserInfo: React.FC<UserInfoProps> = ({ user }) => {
  const iconMap:any = {
    EnvelopeClosedIcon, MobileIcon, GlobeIcon, DrawingPinFilledIcon, HomeIcon, IdCardIcon, BackpackIcon
  }
  const infoRow = (items: InfoRowItem[]) => {
    return (
      <div className="flex flex-wrap md:justify-center gap-x-6 gap-y-2 w-full text-lg my-3">
        {items.map( (item:InfoRowItem) => {
          const Icon = iconMap[item.icon];
          return (
          <div className="flex gap-2 items-center">
            {Icon ? <Icon /> : '#'}
            {item.href ? <a href={item.href} target={item.newTab ? "_blank" : "_self"}> {item.value} </a> : <span> {item.value} </span>}
            {/* {item.innerHTML && <div dangerouslySetInnerHTML={{ __html: item.innerHTML}} />} */} 
          </div>
        )}
      )}
      </div>);
  }

  const websiteUrl = (url:string | undefined) => !url ? "" : url.startsWith('https://') ? url : 'https://' + url;
  const hasGeoInfo = user.address?.geo?.lat && user.address?.geo?.lng
  return (
    <div className="flex flex-col gap-2 md:gap-3 lg:gap-4 w-full">
      {infoRow(
        [
          {icon: null, value: user.id},
          {icon: 'IdCardIcon', value: user.username},
        ]
      )}
      {infoRow(
        [
          {icon: 'MobileIcon', value: user.phone, href:`tel:${user.phone}`},
          {icon: 'EnvelopeClosedIcon', value: user.email, href:`mailto:${user.email}`},
          {icon: 'GlobeIcon', value: user.website, href:websiteUrl(user.website), newTab: true},
        ]
      )}
      {user.address && infoRow(
        [{
          icon: hasGeoInfo ? 'DrawingPinFilledIcon' : 'HomeIcon',
          value: `${user.address.suite}, ${user.address.street}, ${user.address.city}, ${user.address.zipcode}`,
          newTab: !!hasGeoInfo,
          href: hasGeoInfo ? `https://www.google.com/maps?q=${user.address.geo.lat},${user.address.geo.lng}`: ""
      }]
    )}

      {/* {user.company && infoRow(
        [{icon: 'BackpackIcon', innerHTML: `${user.company.name} <span className="text-sm"> | ${user.company.catchPhrase}</span>`}]
      )} */}

      <div className="flex flex-wrap md:justify-center gap-x-6 w-full text-lg">        
        {user.company && (
          <div className="flex gap-2 items-center">
            <BackpackIcon /> 
            <span>
              {user.company.name} <span className="text-sm"> | {user.company.catchPhrase}</span>
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export { UserInfo };
