import { extractTime } from "../../../../backend/utils/exctractTime";
import { useAuthContext } from "../../context/AuthContext";
import userConversation from "../../zustand/useConversation";

const Message = ({message}) => {
	const {authUser} = useAuthContext()
	const {selectedConversation} = userConversation()
	const fromMe = message.sender === authUser._id
	const chatClassName = fromMe ? "chat-end" : "chat-start"
	const ProfilePic = fromMe ? authUser.avatar : selectedConversation.avatar
	const bubbleBgColor = fromMe ? "bg-blue-500" : "";
	const formattedTime = extractTime(message.createdAt)
	const shakeClass = message.shouldShake ? "shake" : ""

	return (
		<div className= {`chat ${chatClassName}`}>
			<div className='chat-image avatar'>
				<div className='w-10 rounded-full'>
					<img
						alt='Tailwind CSS chat bubble component'
						src={ProfilePic}
					/>
				</div>
			</div>
			<div className={`chat-bubble text-white ${bubbleBgColor} ${shakeClass} pb-2`}>{message.message}</div>
			<div className='chat-footer text-white opacity-70 text-xs flex gap-1 items-center'>{formattedTime}</div>
		</div>
	);
};
export default Message;