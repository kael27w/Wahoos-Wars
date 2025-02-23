import { useRouter } from "expo-router";
import React from "react";
import { View } from "react-native";

import { Image } from "@/components/image";
import { SafeAreaView } from "@/components/safe-area-view";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { H1, Muted } from "@/components/ui/typography";

export default function WelcomeScreen() {
	const router = useRouter();

	return (
		<SafeAreaView className="flex flex-1 bg-background p-4">
			<View className="flex flex-1 items-center justify-center gap-y-4 web:m-4">
				<Image
					source={require("@/assets/wwlogo.png")}
					className="h-[11rem] w-[20rem] mt-[3rem]"
				/>
				<H1 className="text-center">Welcome to Wahoo Wars!</H1>
				<Muted className="text-center">
				Compete with other Hoos to become the greatest of them all! Are you a trivia master? An athletic prodigy? A creative genius? No matter your talent, this is your chance to shine and prove you're the best of the best. Whether you're sprinting to victory on the track, solving complex puzzles, or dazzling everyone with your artistic skills, every challenge is an opportunity to show your true colors. So, gather your team, hone your skills, and get ready to push your limits. The road to greatness is paved with challenges, but with determination and a bit of friendly competition, you'll rise to the top. Will you seize the moment and become the greatest of them all?
				</Muted>
			</View>
			<View className="flex flex-col gap-y-4 web:m-4">
				<Button
					size="default"
					variant="default"
					onPress={() => {
						router.push("/sign-up");
					}}
				>
					<Text>Sign Up</Text>
				</Button>
				<Button
					size="default"
					variant="secondary"
					onPress={() => {
						router.push("/sign-in");
					}}
				>
					<Text>Sign In</Text>
				</Button>
			</View>
		</SafeAreaView>
	);
}
