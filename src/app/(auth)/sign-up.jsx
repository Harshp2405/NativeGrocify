import { useAuth, useSignUp } from '@clerk/expo'
import { Image } from 'expo-image'
import { Link, useRouter } from 'expo-router'
import React, { useState } from 'react'
import { Pressable, Text, TextInput, useColorScheme, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

export default function Page() {
  const { signUp, errors, fetchStatus } = useSignUp()
  const { isSignedIn } = useAuth()
  const router = useRouter()
  const colorScheme = useColorScheme()

  const isDark = colorScheme === 'dark'
  const placeholderColor = isDark ? '#9ca3af' : '#6b7280'

  const [emailAddress, setEmailAddress] = useState('')
  const [password, setPassword] = useState('')
  const [code, setCode] = useState('')

  // NEW
  const [formError, setFormError] = useState('')

  const username = emailAddress.split('@')[0]

  const handleSubmit = async () => {
    try {
      setFormError('')

      const { error } = await signUp.password({
        emailAddress,
        password,
        username,
      })

      if (error) {
        console.error(JSON.stringify(error, null, 2))

        // Clerk errors array
        const firstError = error.errors?.[0]

        if (firstError?.code === 'form_identifier_exists') {
          if (firstError.meta?.paramName === 'email_address') {
            setFormError('This email address is already registered.')
          } else if (firstError.meta?.paramName === 'username') {
            setFormError('This username is already taken.')
          } else {
            setFormError(firstError.message)
          }
        } else {
          setFormError(firstError?.message || 'Something went wrong.')
        }

        return
      }

      await signUp.verifications.sendEmailCode()
    } catch (err) {
      console.error(err)
      setFormError('Something went wrong. Please try again.')
    }
  }

  const handleVerify = async () => {
    try {
      setFormError('')

      await signUp.verifications.verifyEmailCode({
        code,
      })

      if (signUp.status === 'complete') {
        await signUp.finalize({
          navigate: ({ session, decorateUrl }) => {
            if (session?.currentTask) {
              console.log(session?.currentTask)
              return
            }

            const url = decorateUrl('/')

            if (url.startsWith('http')) {
              window.location.href = url
            } else {
              router.push(url)
            }
          },
        })
      }
    } catch (err) {
      console.error(err)

      const message =
        err?.errors?.[0]?.message || 'Invalid verification code.'

      setFormError(message)
    }
  }

  if (signUp.status === 'complete' || isSignedIn) {
    return null
  }

  if (
    signUp.status === 'missing_requirements' &&
    signUp.unverifiedFields.includes('email_address') &&
    signUp.missingFields.length === 0
  ) {
    return (
      <SafeAreaView
        className="flex-1 bg-primary dark:bg-background"
        edges={['top']}
      >
        <View className="mt-8 flex-1 rounded-t-[36px] bg-card dark:bg-card px-6 pb-8 pt-6 gap-3">
          <Text className="text-2xl font-bold text-card-foreground">
            Verify your account
          </Text>

          <TextInput
            className="border border-border rounded-2xl p-3 text-base bg-muted text-foreground"
            value={code}
            placeholder="Enter your verification code"
            placeholderTextColor={placeholderColor}
            onChangeText={(code) => setCode(code)}
            keyboardType="numeric"
          />

          {/* VERIFY ERROR */}
          {formError ? (
            <Text className="text-red-500 text-sm">{formError}</Text>
          ) : null}

          <Pressable
            className={`bg-primary h-14 rounded-2xl items-center justify-center mt-2 ${
              fetchStatus === 'fetching' ? 'opacity-50' : ''
            }`}
            onPress={handleVerify}
            disabled={fetchStatus === 'fetching'}
          >
            <Text className="text-primary-foreground font-semibold text-base">
              Verify
            </Text>
          </Pressable>

          <Pressable
            className="py-3 px-6 rounded-2xl items-center mt-2"
            onPress={() => signUp.verifications.sendEmailCode()}
          >
            <Text className="text-primary font-semibold">
              I need a new code
            </Text>
          </Pressable>
        </View>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView
      className="flex-1 bg-primary dark:bg-background"
      edges={['top']}
    >
      <View className="absolute -left-16 top-12 h-56 w-56 rounded-full bg-primary/60 dark:bg-primary/20" />
      <View className="absolute right-[-74px] top-40 h-72 w-72 rounded-full bg-primary/40 dark:bg-primary/10" />

      <View className="px-6 pt-4">
        <Text className="text-center text-5xl font-extrabold tracking-tight text-primary-foreground uppercase font-mono">
          Grocify
        </Text>

        <Text className="mt-1 text-center text-[14px] text-primary-foreground/80">
          Plan smarter. Shop happier.
        </Text>

        <View className="mt-6 rounded-[30px] border border-primary-foreground/20 bg-primary-foreground/10 p-3">
          <Image
            source={require('../../../assets/images/auth.png')}
            style={{ width: '100%', height: 200 }}
            contentFit="contain"
          />
        </View>
      </View>

      <View className="mt-8 flex-1 rounded-t-[36px] bg-card px-6 pb-8 pt-6">
        <View className="self-center rounded-full bg-secondary px-3 py-1">
          <Text className="text-xs font-semibold uppercase tracking-[1px] text-secondary-foreground">
            Create Account
          </Text>
        </View>

        <View className="mt-4 gap-3">
          <Text className="font-semibold text-sm text-card-foreground">
            Email address
          </Text>

          <TextInput
            className="border border-border rounded-2xl p-3 text-base bg-muted text-foreground"
            autoCapitalize="none"
            value={emailAddress}
            placeholder="Enter email"
            placeholderTextColor={placeholderColor}
            onChangeText={(emailAddress) =>
              setEmailAddress(emailAddress)
            }
            keyboardType="email-address"
          />

          <Text className="font-semibold text-sm text-card-foreground">
            Password
          </Text>

          <TextInput
            className="border border-border rounded-2xl p-3 text-base bg-muted text-foreground"
            value={password}
            placeholder="Enter password"
            placeholderTextColor={placeholderColor}
            secureTextEntry
            onChangeText={(password) => setPassword(password)}
          />

          {/* FORM ERROR */}
          {formError ? (
            <Text className="text-red-500 text-sm">{formError}</Text>
          ) : null}

          <Pressable
            className={`bg-primary h-14 rounded-2xl items-center justify-center mt-2 ${
              !emailAddress || !password || fetchStatus === 'fetching'
                ? 'opacity-50'
                : ''
            }`}
            onPress={handleSubmit}
            disabled={
              !emailAddress || !password || fetchStatus === 'fetching'
            }
          >
            <Text className="text-primary-foreground font-semibold text-base">
              Sign up
            </Text>
          </Pressable>
        </View>

        <View className="flex-row gap-1 mt-4 items-center justify-center">
          <Text className="text-sm text-muted-foreground">
            Already have an account?
          </Text>

          <Link href="/sign-in">
            <Text className="text-primary font-semibold text-sm">
              Sign in
            </Text>
          </Link>
        </View>

        <View nativeID="clerk-captcha" />
      </View>
    </SafeAreaView>
  )
}