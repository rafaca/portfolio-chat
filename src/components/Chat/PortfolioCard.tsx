"use client";

import { Project } from "@/types";
import Image from "next/image";

interface PortfolioCardProps {
  project: Project;
}

export default function PortfolioCard({ project }: PortfolioCardProps) {
  return (
    <a
      href={project.url}
      target="_blank"
      rel="noopener noreferrer"
      className="portfolio-card block rounded-xl overflow-hidden my-3 no-underline"
    >
      {/* Image */}
      {project.imageUrl && (
        <div className="relative w-full aspect-[4/3] bg-gray-100">
          <Image
            src={project.imageUrl}
            alt={project.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 400px"
            unoptimized={project.imageUrl.endsWith('.gif')}
          />
        </div>
      )}

      {/* Content */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-base font-medium" style={{ color: "var(--accent)" }}>
              {project.title}
            </h3>
            <p className="text-sm" style={{ color: "var(--text-muted)" }}>
              {project.client} &middot; {project.type}
            </p>
          </div>
          <span className="text-xs shrink-0" style={{ color: "var(--text-muted)" }}>
            View &rarr;
          </span>
        </div>
      </div>
    </a>
  );
}
