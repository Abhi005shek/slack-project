import { Button } from "@/components/ui/button";
import { FaChevronDown } from "react-icons/fa";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface HeaderProps {
  memberName?: string;
  memberImage?: string;
  onClick?: () => void;
}

function Header({ memberName="Member", memberImage, onClick }: HeaderProps) {
  const avatarFallback = memberName?.charAt(0).toUpperCase();

  return (
    <>
      <div className="bg-white border-b h-[49px] flex items-center px-4 overflow-hidden">
        <Button
          variant={"ghost"}
          size={"sm"}
          className="text-lg font-semibold px-2 w-auto overflow-hidden"
          onClick={onClick}
        >
          <Avatar>
            <AvatarImage src={memberImage} />
            <AvatarFallback>{avatarFallback}</AvatarFallback>
          </Avatar>
          <span className="truncate">{memberName}</span>
          <FaChevronDown className="size-2.5 ml-2" />
        </Button>
      </div>
    </>
  );
}

export default Header;
