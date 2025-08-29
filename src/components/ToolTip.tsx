import React from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Image from "next/image";

type ToolTipProps = {
  trigger: React.ReactNode;
  imageSrc: string;
  imageAlt: string;
};

const ToolTip = ({ trigger, imageSrc, imageAlt }: ToolTipProps) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>{trigger}</TooltipTrigger>
        <TooltipContent>
          <Image
            src={imageSrc}
            alt={imageAlt}
            className="object-cover"
            width={100}
            height={100}
          />
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default ToolTip;
