"use client";
import React, { useEffect, useRef } from "react";

interface NotFoundFuzzyTextProps {
  children: React.ReactNode;
  fontSize?: number | string;
  fontWeight?: string | number;
  fontFamily?: string;
  color?: string;
  colorClass?: string; // New prop for Tailwind classes
  enableHover?: boolean;
  baseIntensity?: number;
  hoverIntensity?: number;
  classname?: string;
}

const NotFoundFuzzyText: React.FC<NotFoundFuzzyTextProps> = ({
  children,
  fontSize = "clamp(2rem, 8vw, 8rem)",
  fontWeight = 900,
  fontFamily = "inherit",
  color,
  colorClass, // New prop
  enableHover = true,
  baseIntensity = 0.18,
  hoverIntensity = 0.5,
  classname,
}) => {
  const canvasRef = useRef<
    HTMLCanvasElement & { cleanupNotFoundFuzzyText?: () => void }
  >(null);
  const hiddenElementRef = useRef<HTMLDivElement>(null);

  // Function to get computed color from Tailwind class
  const getComputedColor = (): string => {
    if (color) return color; // Use direct color if provided

    if (colorClass && hiddenElementRef.current) {
      const computedStyle = window.getComputedStyle(hiddenElementRef.current);
      return computedStyle.color;
    }

    return "#fff"; // fallback
  };

  useEffect(() => {
    let animationFrameId: number;
    let isCancelled = false;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const init = async () => {
      if (document.fonts?.ready) {
        await document.fonts.ready;
      }
      if (isCancelled) return;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const computedFontFamily =
        fontFamily === "inherit"
          ? window.getComputedStyle(canvas).fontFamily || "Arial, sans-serif"
          : fontFamily;

      const fontSizeStr =
        typeof fontSize === "number" ? `${fontSize}px` : fontSize;
      let numericFontSize: number;
      if (typeof fontSize === "number") {
        numericFontSize = fontSize;
      } else {
        const temp = document.createElement("span");
        temp.style.fontSize = fontSize;
        document.body.appendChild(temp);
        const computedSize = window.getComputedStyle(temp).fontSize;
        numericFontSize = parseFloat(computedSize);
        document.body.removeChild(temp);
      }

      const text = React.Children.toArray(children).join("");
      const actualColor = getComputedColor(); // Get the computed color

      const offscreen = document.createElement("canvas");
      const offCtx = offscreen.getContext("2d");
      if (!offCtx) return;

      offCtx.font = `${fontWeight} ${fontSizeStr} ${computedFontFamily}`;
      offCtx.textBaseline = "alphabetic";
      const metrics = offCtx.measureText(text);

      const actualLeft = metrics.actualBoundingBoxLeft ?? 0;
      const actualRight = metrics.actualBoundingBoxRight ?? metrics.width;
      const actualAscent = metrics.actualBoundingBoxAscent ?? numericFontSize;
      const actualDescent =
        metrics.actualBoundingBoxDescent ?? numericFontSize * 0.2;

      const textBoundingWidth = Math.ceil(actualLeft + actualRight);
      const tightHeight = Math.ceil(actualAscent + actualDescent);

      const extraWidthBuffer = 10;
      const offscreenWidth = textBoundingWidth + extraWidthBuffer;

      offscreen.width = offscreenWidth;
      offscreen.height = tightHeight;

      const xOffset = extraWidthBuffer / 2;
      offCtx.font = `${fontWeight} ${fontSizeStr} ${computedFontFamily}`;
      offCtx.textBaseline = "alphabetic";
      offCtx.fillStyle = actualColor; // Use computed color
      offCtx.fillText(text, xOffset - actualLeft, actualAscent);

      // ...existing code for canvas setup and animation...
      const horizontalMargin = 50;
      const verticalMargin = 0;
      canvas.width = offscreenWidth + horizontalMargin * 2;
      canvas.height = tightHeight + verticalMargin * 2;
      ctx.translate(horizontalMargin, verticalMargin);

      const interactiveLeft = horizontalMargin + xOffset;
      const interactiveTop = verticalMargin;
      const interactiveRight = interactiveLeft + textBoundingWidth;
      const interactiveBottom = interactiveTop + tightHeight;

      let isHovering = false;
      const fuzzRange = 30;

      const run = () => {
        if (isCancelled) return;
        ctx.clearRect(
          -fuzzRange,
          -fuzzRange,
          offscreenWidth + 2 * fuzzRange,
          tightHeight + 2 * fuzzRange
        );
        const intensity = isHovering ? hoverIntensity : baseIntensity;
        for (let j = 0; j < tightHeight; j++) {
          const dx = Math.floor(intensity * (Math.random() - 0.5) * fuzzRange);
          ctx.drawImage(
            offscreen,
            0,
            j,
            offscreenWidth,
            1,
            dx,
            j,
            offscreenWidth,
            1
          );
        }
        animationFrameId = window.requestAnimationFrame(run);
      };

      run();

      // ...existing event handlers...
      const isInsideTextArea = (x: number, y: number) =>
        x >= interactiveLeft &&
        x <= interactiveRight &&
        y >= interactiveTop &&
        y <= interactiveBottom;

      const handleMouseMove = (e: MouseEvent) => {
        if (!enableHover) return;
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        isHovering = isInsideTextArea(x, y);
      };

      const handleMouseLeave = () => {
        isHovering = false;
      };

      const handleTouchMove = (e: TouchEvent) => {
        if (!enableHover) return;
        e.preventDefault();
        const rect = canvas.getBoundingClientRect();
        const touch = e.touches[0];
        const x = touch.clientX - rect.left;
        const y = touch.clientY - rect.top;
        isHovering = isInsideTextArea(x, y);
      };

      const handleTouchEnd = () => {
        isHovering = false;
      };

      if (enableHover) {
        canvas.addEventListener("mousemove", handleMouseMove);
        canvas.addEventListener("mouseleave", handleMouseLeave);
        canvas.addEventListener("touchmove", handleTouchMove, {
          passive: false,
        });
        canvas.addEventListener("touchend", handleTouchEnd);
      }

      const cleanup = () => {
        window.cancelAnimationFrame(animationFrameId);
        if (enableHover) {
          canvas.removeEventListener("mousemove", handleMouseMove);
          canvas.removeEventListener("mouseleave", handleMouseLeave);
          canvas.removeEventListener("touchmove", handleTouchMove);
          canvas.removeEventListener("touchend", handleTouchEnd);
        }
      };

      canvas.cleanupNotFoundFuzzyText = cleanup;
    };

    init();

    return () => {
      isCancelled = true;
      window.cancelAnimationFrame(animationFrameId);
      if (canvas && canvas.cleanupNotFoundFuzzyText) {
        canvas.cleanupNotFoundFuzzyText();
      }
    };
  }, [
    children,
    fontSize,
    fontWeight,
    fontFamily,
    color,
    colorClass, // Add to dependencies
    enableHover,
    baseIntensity,
    hoverIntensity,
    classname,
  ]);

  return (
    <>
      {/* Hidden element to compute Tailwind color */}
      {colorClass && (
        <div
          ref={hiddenElementRef}
          className={`${colorClass} absolute opacity-0 pointer-events-none`}
          style={{ position: "absolute", left: "-9999px" }}
        />
      )}
      <canvas className={classname} ref={canvasRef} />
    </>
  );
};

export default NotFoundFuzzyText;
