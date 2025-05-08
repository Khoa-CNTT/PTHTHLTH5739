import React from "react";
import Navbar from "../../components/user-components/Navbar";
import Footer from "../../components/user-components/Footer";
import PageHeader from "../../components/user-components/PageHeader";
import ChatRoom from "../../components/user-components/chatRoom";
import HorizontalMenu from "../../components/user-components/HorizontalMenu";
import { useParams } from "react-router-dom";

export default function ChatRoomPage() {
  return (
    <>
      <ChatRoom />
    </>
  );
}
