import SpeakerSignup from '../components/initiatives/SpeakerSignUp';
import MeetThePros from '../components/initiatives/MeetThePros';

export default function Initiatives() {
  return (
    <div className="w-full flex flex-col items-center justify-center overflow-hidden px-4 pt-48">
      <MeetThePros />
      <SpeakerSignup />
    </div>
  );
}
