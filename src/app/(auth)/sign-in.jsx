import { useSignIn } from '@clerk/expo'
import { Image } from 'expo-image'
import { Link, useRouter } from 'expo-router'
import React, { useState } from 'react'
import { Pressable, Text, TextInput, useColorScheme, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

export default function Page() {
  const { signIn, errors, fetchStatus } = useSignIn()
  const router = useRouter()
  const colorScheme = useColorScheme()
  const isDark = colorScheme === 'dark'
  const placeholderColor = isDark ? '#9ca3af' : '#6b7280'

  const [emailAddress, setEmailAddress] = useState('')
  const [password, setPassword] = useState('')
  const [code, setCode] = useState('')
  const [formError, setFormError] = useState('')

  const handleSubmit = async () => {
    try {
      setFormError('')
      const { error } = await signIn.password({
        emailAddress,
        password,
      })
      if (error) {
        console.error(JSON.stringify(error, null, 2))
        const firstError = error.errors?.[0]
        setFormError(firstError?.message || 'Something went wrong.')
        return
      }

      if (signIn.status === 'complete') {
        await signIn.finalize({
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
      } else if (signIn.status === 'needs_second_factor' || signIn.status === 'needs_client_trust') {
        const emailCodeFactor = signIn.supportedSecondFactors?.find(
          (factor) => factor.strategy === 'email_code',
        )

        if (emailCodeFactor) {
          await signIn.mfa.sendEmailCode()

        } else {
          setFormError('Verification code strategy email_code not supported.')
        }
      } else {
        console.error('Sign-in attempt not complete:', signIn)
        setFormError(`Sign-in status: ${signIn.status}`)
      }
    } catch (err) {
      console.error(err)
      setFormError(err?.message || 'Something went wrong.')
    }
  }

  const handleVerify = async () => {
    try {
      setFormError('')
      await signIn.mfa.verifyEmailCode({ code })

      if (signIn.status === 'complete') {
        await signIn.finalize({
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
      } else {
        console.error('Sign-in attempt not complete:', signIn)
        setFormError(`Sign-in status: ${signIn.status}`)
      }
    } catch (err) {
      console.error(err)
      setFormError(err?.message || 'Something went wrong.')
    }
  }

  if (signIn.status === 'needs_client_trust' || signIn.status === 'needs_second_factor') {
    return (
      <SafeAreaView className="flex-1 bg-primary dark:bg-background" edges={['top']}>
        <View className="mt-8 flex-1 rounded-t-[36px] bg-card dark:bg-card px-6 pb-8 pt-6 gap-3">
          <Text className="text-2xl font-bold text-card-foreground mb-2">Verify your account</Text>
          <TextInput
            className="border border-border rounded-2xl p-3 text-base bg-muted dark:bg-muted text-card-foreground"
            value={code}
            placeholder="Enter your verification code"
            placeholderTextColor={placeholderColor}
            onChangeText={(code) => setCode(code)}
            keyboardType="numeric"
          />
          {errors.fields.code && (
            <Text className="text-red-700 text-xs -mt-2">{errors.fields.code.message}</Text>
          )}
          {formError ? (
            <Text className="text-red-500 text-sm mt-1">{formError}</Text>
          ) : null}
          <Pressable
            className={`bg-primary h-14 rounded-2xl items-center justify-center mt-2 active:opacity-90 ${fetchStatus === 'fetching' ? 'opacity-50' : ''}`}
            onPress={handleVerify}
            disabled={fetchStatus === 'fetching'}
          >
            <Text className="text-primary-foreground font-semibold text-base">Verify</Text>
          </Pressable>
          <Pressable
            className="py-3 px-6 rounded-2xl items-center mt-2"
            onPress={() => signIn.mfa.sendEmailCode()}
          >
            <Text className="text-primary dark:text-primary font-semibold">I need a new code</Text>
          </Pressable>
          <Pressable
            className="py-3 px-6 rounded-2xl items-center mt-2"
            onPress={() => signIn.reset()}
          >
            <Text className="text-primary dark:text-primary font-semibold">Start over</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView className="flex-1 bg-primary dark:bg-background" edges={['top']}>
      {/* Decorative elements */}
      <View className="absolute -left-16 top-12 h-56 w-56 rounded-full bg-primary/60 dark:bg-primary/20" />
      <View className="absolute right-[-74px] top-40 h-72 w-72 rounded-full bg-primary/40 dark:bg-primary/10" />

      <View className="px-6 pt-4">
        <Text className="text-center text-5xl font-extrabold tracking-tight text-primary-foreground dark:text-primary uppercase font-mono">
          Grocify
        </Text>
        <Text className="mt-1 text-center text-[14px] text-primary-foreground/80 dark:text-foreground/70">
          Plan smarter. Shop happier.
        </Text>

        <View className="mt-6 rounded-[30px] border border-primary-foreground/20 dark:border-primary/20 bg-primary-foreground/10 dark:bg-primary/10 p-3">
          <Image
            source={require('../../../assets/images/auth.png')}
            style={{ width: '100%', height: 220 }}
            contentFit="contain"
          />
        </View>
      </View>

      <View className="mt-8 flex-1 rounded-t-[36px] bg-card dark:bg-card px-6 pb-8 pt-6">
        <View className="self-center rounded-full bg-secondary dark:bg-secondary px-3 py-1">
          <Text className="text-xs font-semibold uppercase tracking-[1px] text-secondary-foreground dark:text-secondary-foreground">
            Welcome Back
          </Text>
        </View>

        <View className="mt-4 gap-3">
          <Text className="font-semibold text-sm text-card-foreground dark:text-card-foreground">Email address</Text>
          <TextInput
            className="border border-border dark:border-border rounded-2xl p-3 text-base bg-muted dark:bg-muted text-foreground dark:text-foreground"
            autoCapitalize="none"
            value={emailAddress}
            placeholder="Enter email"
            placeholderTextColor={placeholderColor}
            onChangeText={(emailAddress) => setEmailAddress(emailAddress)}
            keyboardType="email-address"
          />
          {errors.fields.identifier && (
            <Text className="text-destructive-foreground dark:text-destructive-foreground text-xs -mt-2">{errors.fields.identifier.message}</Text>
          )}
          <Text className="font-semibold text-sm text-card-foreground dark:text-card-foreground">Password</Text>
          <TextInput
            className="border border-border dark:border-border rounded-2xl p-3 text-base bg-muted dark:bg-muted text-foreground dark:text-foreground"
            value={password}
            placeholder="Enter password"
            placeholderTextColor={placeholderColor}
            secureTextEntry={true}
            onChangeText={(password) => setPassword(password)}
          />
          {errors.fields.password && (
            <Text className="text-destructive-foreground dark:text-destructive-foreground text-xs -mt-2">{errors.fields.password.message}</Text>
          )}
          {formError ? (
            <Text className="text-red-500 text-sm mt-1">{formError}</Text>
          ) : null}
          <Pressable
            className={`bg-primary h-14 rounded-2xl items-center justify-center mt-2 active:opacity-90 ${(!emailAddress || !password || fetchStatus === 'fetching') ? 'opacity-50' : ''}`}
            onPress={handleSubmit}
            disabled={!emailAddress || !password || fetchStatus === 'fetching'}
          >
            <Text className="text-primary-foreground font-semibold text-base">Continue</Text>
          </Pressable>
        </View>

        <View className="flex-row gap-1 mt-4 items-center justify-center">
          <Text className="text-sm text-muted-foreground dark:text-muted-foreground">Don't have an account? </Text>
          <Link href="/sign-up">
            <Text className="text-primary dark:text-primary font-semibold text-sm">Sign up</Text>
          </Link>
        </View>
      </View>
    </SafeAreaView>
  )
}





// import { AuthView } from '@clerk/expo/native'
// import { useAuth } from '@clerk/expo'
// import { useRouter } from 'expo-router'
// import { useEffect } from 'react'

// export default function SignInScreen() {
//   const { isSignedIn } = useAuth({ treatPendingAsSignedOut: false })
//   const router = useRouter()

//   useEffect(() => {
//     if (isSignedIn) {
//       router.replace('/(home)')
//     }
//   }, [isSignedIn])

//   return <AuthView mode="signInOrUp" />
// }

// Sign-in only

// <AuthView mode="signIn" />
// Sign-up only

// <AuthView mode="signUp" />






