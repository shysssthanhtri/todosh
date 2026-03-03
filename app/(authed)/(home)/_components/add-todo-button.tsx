"use client";

import { ArrowUp, AtSign, Globe, Paperclip, Plus } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Textarea } from "@/components/ui/textarea";

export const AddTodoButton = () => {
  const [value, setValue] = useState("");

  return (
    <Drawer direction="bottom">
      <DrawerTrigger asChild>
        <Button
          size="icon"
          className="fixed right-6 bottom-6 size-12 rounded-full shadow-lg"
        >
          <Plus className="size-6" />
          <span className="sr-only">Add</span>
        </Button>
      </DrawerTrigger>
      <DrawerContent className="px-4 pb-4">
        <DrawerTitle className="sr-only">Add Todo</DrawerTitle>
        <div className="flex flex-col gap-3">
          {/* Add context button */}
          <div>
            <Button variant="outline" size="sm" className="rounded-full">
              <AtSign className="size-4" />
              Add context
            </Button>
          </div>

          {/* Text input */}
          <Textarea
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Ask, search, or make anything..."
            className="min-h-15 resize-none border-0 p-0 text-base shadow-none focus-visible:ring-0"
          />

          {/* Bottom action bar */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="icon" className="size-8">
                <Paperclip className="size-4" />
                <span className="sr-only">Attach</span>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-muted-foreground"
              >
                Auto
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-muted-foreground"
              >
                <Globe className="size-4" />
                All Sources
              </Button>
            </div>
            <Button
              size="icon"
              className="size-10 rounded-full"
              disabled={!value.trim()}
            >
              <ArrowUp className="size-5" />
              <span className="sr-only">Submit</span>
            </Button>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
};
