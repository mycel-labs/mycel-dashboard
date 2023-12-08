import { Link } from "react-router-dom";
import { useStore } from "@/store/index";
import useOnboarding from "@/hooks/useOnboarding";
import { X, Lightbulb } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/Tooltip";

export default function MessageBar() {
  const onboardingStatus = useStore((state) => state.onboardingStatus);
  const updateOnboardingStatus = useStore((state) => state.updateOnboardingStatus);
  const { ONBOARDING_CONFIG } = useOnboarding();

  const onboardingMessage = onboardingStatus ? ONBOARDING_CONFIG[onboardingStatus]?.message : undefined;

  const OnboardingMessage = () =>
    onboardingStatus && onboardingMessage ? (
      <div className="flex items-center justify-around">
        <div className="flex flex-1 justify-center items-center">
          <Lightbulb className="mr-2 text-chocolat" size={16} />
          {ONBOARDING_CONFIG[onboardingStatus]?.link ? (
            <Link className="hover:underline" to={ONBOARDING_CONFIG[onboardingStatus]?.link}>
              {`${ONBOARDING_CONFIG[onboardingStatus]?.index}. ${ONBOARDING_CONFIG[onboardingStatus]?.message}` ?? ""}
            </Link>
          ) : ONBOARDING_CONFIG[onboardingStatus]?.action ? (
            <button className="hover:underline" onClick={ONBOARDING_CONFIG[onboardingStatus]?.action}>
              {ONBOARDING_CONFIG[onboardingStatus]?.message ?? ""}
            </button>
          ) : (
            ONBOARDING_CONFIG[onboardingStatus]?.message ?? ""
          )}
        </div>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <button title="Hide this tutorial" className="ml-auto" onClick={() => updateOnboardingStatus("hide")}>
                <X className="ml-4" size={18} />
              </button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Hide this tutorial</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    ) : null;

  return onboardingMessage ? (
    <div className="w-full text-center py-3 px-6 bg-lemon/70 text-gray-600 text-sm">
      <OnboardingMessage />
    </div>
  ) : null;
}
