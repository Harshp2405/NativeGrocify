import { useGroceryStore } from "@/store/groceryStore";
import React, { useState, useEffect, useRef } from "react";
import { View, Text, Pressable, Share, TextInput, ScrollView, KeyboardAvoidingView, Platform } from "react-native";
import { socket } from "../../lib/socket";
import { SafeAreaView } from "react-native-safe-area-context";

// 1. Collaborative Header sub-component
function CollaborationHeader() {
  const { roomId, createRoom, joinRoom, leaveRoom, loadPersistedRoom, activeShoppers, initSocketSync, cleanupSocketSync } = useGroceryStore();
  const [inputRoomId, setInputRoomId] = useState("");
  const [isJoining, setIsJoining] = useState(false);

  // Load persisted room on mount
  useEffect(() => {
    loadPersistedRoom();
  }, []);

  useEffect(() => {
    if (roomId) {
      initSocketSync();
    }
    return () => {
      cleanupSocketSync();
    };
  }, [roomId]);

  const handleShareList = async () => {
    try {
      await Share.share({
        message: `Join my collaborative shopping list on Grocify! Active Room ID: ${roomId}`,
      });
    } catch (error) {
      console.error(error.message);
    }
  };

  const handleJoinSubmit = () => {
    if (inputRoomId.trim()) {
      joinRoom(inputRoomId.trim());
      setInputRoomId("");
      setIsJoining(false);
    }
  };

  return (
    <View className='bg-card dark:bg-card p-4 rounded-3xl border border-border gap-4'>
      {/* 1. Header & Info */}
      <View className='flex-row items-center justify-between'>
        <View className='flex-1'>
          <Text className='text-card-foreground font-bold text-lg'>
            Collaborative Shopping
          </Text>
          <Text className='text-muted-foreground text-xs mt-0.5'>
            {roomId ? `Active Room: ${roomId}` : "Not sharing this list yet"}
          </Text>
        </View>

        {roomId && (
          <View className="flex-row items-center gap-2">
            <Pressable
              onPress={handleShareList}
              className='bg-primary px-3.5 py-2.5 rounded-2xl active:opacity-90 flex-row items-center'>
              <Text className='text-primary-foreground font-semibold text-sm'>
                Invite
              </Text>
            </Pressable>
            <Pressable
              onPress={leaveRoom}
              className='bg-red-500/10 border border-red-500/20 px-3.5 py-2.5 rounded-2xl active:opacity-90 flex-row items-center'>
              <Text className='text-red-500 font-semibold text-sm'>
                Leave
              </Text>
            </Pressable>
          </View>
        )}
      </View>

      {/* 1.5 Active Shoppers List */}
      {roomId && activeShoppers && activeShoppers.length > 0 && (
        <View className='border-t border-border/40 pt-3 gap-2'>
          <Text className='text-muted-foreground text-xs font-semibold uppercase tracking-[0.5px]'>
            Active Shoppers ({activeShoppers.length})
          </Text>
          <View className='flex-row flex-wrap gap-2'>
            {activeShoppers.map((shopperId) => {
              const isMe = shopperId === socket.id;
              return (
                <View
                  key={shopperId}
                  className={`px-3 py-1.5 rounded-full border flex-row items-center gap-1.5 ${
                    isMe
                      ? "bg-primary/10 border-primary/30"
                      : "bg-muted border-border/40"
                  }`}>
                  <View
                    className={`w-2 h-2 rounded-full ${
                      isMe ? "bg-primary" : "bg-emerald-500"
                    } animate-pulse`}
                  />
                  <Text
                    className={`text-xs font-semibold ${
                      isMe ? "text-primary" : "text-foreground"
                    }`}>
                    {isMe ? "You" : `Shopper ${shopperId.substring(0, 4)}`}
                  </Text>
                </View>
              );
            })}
          </View>
        </View>
      )}

      {/* 2. Join Input State */}
      {isJoining && !roomId && (
        <View className='flex-row items-center gap-2 border-t border-border/40 pt-3'>
          <TextInput
            value={inputRoomId}
            onChangeText={setInputRoomId}
            placeholder='Paste active Room ID here'
            placeholderTextColor='#888'
            className='flex-1 border border-border rounded-2xl p-2.5 text-sm bg-muted text-foreground'
            autoCapitalize='none'
            autoCorrect={false}
          />
          <Pressable
            onPress={handleJoinSubmit}
            className='bg-primary px-4 py-2.5 rounded-2xl active:opacity-90'
            disabled={!inputRoomId.trim()}>
            <Text className='text-primary-foreground font-semibold text-sm'>
              Submit
            </Text>
          </Pressable>
          <Pressable
            onPress={() => {
              setIsJoining(false);
              setInputRoomId("");
            }}
            className='bg-muted border border-border px-3 py-2.5 rounded-2xl active:opacity-90'>
            <Text className='text-muted-foreground font-semibold text-sm'>
              Cancel
            </Text>
          </Pressable>
        </View>
      )}

      {/* 3. Non-Sharing Menu States */}
      {!roomId && !isJoining && (
        <View className='flex-row items-center gap-2 border-t border-border/40 pt-3'>
          <Pressable
            onPress={createRoom}
            className='flex-1 bg-secondary py-3 rounded-2xl active:opacity-90 items-center'>
            <Text className='text-secondary-foreground font-semibold text-sm'>
              Create Shared List
            </Text>
          </Pressable>

          <Pressable
            onPress={() => setIsJoining(true)}
            className='flex-1 bg-muted border border-border py-3 rounded-2xl active:opacity-90 items-center'>
            <Text className='text-muted-foreground font-semibold text-sm'>
              Join Existing List
            </Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}

// 2. Main Chat App Screen Export
export default function ChatApp() {
  const { roomId, messages, sendMessage } = useGroceryStore();
  const [chatInput, setChatInput] = useState("");
  const scrollViewRef = useRef();

  const handleSend = () => {
    if (chatInput.trim()) {
      sendMessage(chatInput.trim());
      setChatInput("");
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-background dark:bg-background px-4 py-3" edges={["top"]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1 gap-4"
      >
        {/* Collaborative Header */}
        <CollaborationHeader />

        {/* Chat Section */}
        {roomId ? (
          <View className="flex-1 bg-card border border-border rounded-3xl overflow-hidden p-4 gap-3">
            <View className="flex-row items-center justify-between border-b border-border/40 pb-2">
              <Text className="text-card-foreground font-bold text-sm">Live Room Chat</Text>
              <View className="bg-emerald-500/10 px-2 py-0.5 rounded-md">
                <Text className="text-emerald-500 text-[10px] font-bold uppercase">Temporary</Text>
              </View>
            </View>

            {/* Scrollable messages */}
            <ScrollView
              ref={scrollViewRef}
              onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
              showsVerticalScrollIndicator={false}
              className="flex-1"
              contentContainerStyle={{ gap: 12, paddingBottom: 10 }}
            >
              {messages.length === 0 ? (
                <View className="flex-1 items-center justify-center py-20 gap-2">
                  <Text className="text-muted-foreground text-sm text-center">No messages yet.</Text>
                  <Text className="text-muted-foreground/60 text-xs text-center">Type below to start chatting with joined shoppers!</Text>
                </View>
              ) : (
                messages.map((msg) => {
                  const isMe = msg.senderId === socket.id;
                  return (
                    <View
                      key={msg.id}
                      className={`max-w-[80%] rounded-2xl px-4 py-2.5 ${
                        isMe
                          ? 'self-end bg-primary rounded-tr-none'
                          : 'self-start bg-muted border border-border/40 rounded-tl-none'
                      }`}
                    >
                      {!isMe && (
                        <Text className="text-[10px] font-bold text-primary/80 mb-1">
                          Shopper {msg.senderId?.substring(0, 4)}
                        </Text>
                      )}
                      <Text className={`text-sm ${isMe ? 'text-primary-foreground font-medium' : 'text-foreground'}`}>
                        {msg.text}
                      </Text>
                      <Text className={`text-[9px] text-right mt-1 opacity-50 ${isMe ? 'text-primary-foreground' : 'text-muted-foreground'}`}>
                        {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </Text>
                    </View>
                  );
                })
              )}
            </ScrollView>

            {/* Message input bar */}
            <View className="flex-row items-center gap-2 border-t border-border/40 pt-3">
              <TextInput
                value={chatInput}
                onChangeText={setChatInput}
                placeholder="Type a message..."
                placeholderTextColor="#888"
                className="flex-1 border border-border rounded-2xl px-4 py-3 text-sm bg-muted text-foreground"
                autoCapitalize="none"
                autoCorrect={true}
              />
              <Pressable
                onPress={handleSend}
                disabled={!chatInput.trim()}
                className={`bg-primary h-12 w-12 rounded-2xl items-center justify-center active:opacity-90 ${
                  !chatInput.trim() ? 'opacity-50' : ''
                }`}
              >
                <Text className="text-primary-foreground font-bold text-sm">Send</Text>
              </Pressable>
            </View>
          </View>
        ) : (
          <View className="flex-1 items-center justify-center border border-border border-dashed rounded-3xl p-6 gap-3">
            <Text className="text-muted-foreground font-semibold text-lg text-center">Offline Chat Room</Text>
            <Text className="text-muted-foreground/60 text-sm text-center">
              Please click "Create Shared List" or "Join Existing List" above to connect to a collaborative room and enable real-time messaging!
            </Text>
          </View>
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
