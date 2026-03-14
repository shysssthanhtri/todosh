import { ComponentExample } from "@/components/component-example";

export default async function Page({
  params,
  searchParams,
}: {
  params?: Promise<Record<string, string | string[]>>;
  searchParams?: Promise<Record<string, string | string[]>>;
}) {
  await params;
  await searchParams;
  return <ComponentExample />;
}
