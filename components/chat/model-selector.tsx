"use client";

import { models } from "@/utils/models";
import { ChevronDown } from "lucide-react";
import { modelProviderIcons } from "../model-provider-icons";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

interface ModelSelectorProps {
  selectedModel: string;
  onModelChange: (model: string) => void;
}

export const ModelSelector = ({
  selectedModel,
  onModelChange,
}: ModelSelectorProps) => {
  const model = models.find((model) => model.id === selectedModel);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="-ml-2 px-2">
          {model?.name} <ChevronDown />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {models.map((model) => {
          const [provider] = model.id.split("/");
          const Icon =
            modelProviderIcons[provider as keyof typeof modelProviderIcons];

          return (
            <DropdownMenuItem
              key={model.id}
              onSelect={() => onModelChange(model.id)}
            >
              <Icon />
              {model.name}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
