import { STRINGS } from '../constants/strings';
import { useTrackerStore } from '../store/useTrackerStore';

export function useStrings() {
  const language = useTrackerStore((s) => s.language);
  return STRINGS[language];
}
