import { signIn, useSession } from 'next-auth/client';
import { useRouter } from 'next/router';
import { api } from '../../services/api';
import { getStripeJs } from '../../services/stripe-js';
import styles from './styles.module.scss';

interface SubscribeButton {
    priceId: string;
}

export function SubscribeButton({ priceId }: SubscribeButton) {
    const [ session ] = useSession();
    const router = useRouter()

   async function handleSubscribe() {
        if (!session) {
            signIn ('github')
            return;
        }

        console.log(session)
        console.log(session?.activeSubscription)

        if (session.activeSubscription) {
            router.push('/posts');
            return;
        }

        try {
            const response = await api.post('/subscribe')

            const { sessionId } = response.data;

            const stripe = await getStripeJs()

         await stripe.redirectToCheckout({sessionId})
        } catch (err) {
            alert(err.message);
        }
    }

    return (
        <button
            type="button"
            className={styles.subscribeButton}
            onClick={() => handleSubscribe()}
        >
            Subscribe now
        </button>
    )
}