import React from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Image from "next/image";
import { Loader2 } from "lucide-react";

type ToolTipProps = {
  trigger: React.ReactNode;
  imageSrc: string;
  imageAlt: string;
  loading?: boolean;
};

const ToolTip = ({ trigger, imageSrc, imageAlt, loading }: ToolTipProps) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>{trigger}</TooltipTrigger>
        <TooltipContent>
          {loading ? (
            <div className="w-32 h-20 flex items-center justify-center">
              <Loader2 className="animate-spin " />
            </div>
          ) : (
            <Image
              src={imageSrc}
              alt={imageAlt}
              className="object-cover"
              width={100}
              height={100}
            />
          )}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default ToolTip;
