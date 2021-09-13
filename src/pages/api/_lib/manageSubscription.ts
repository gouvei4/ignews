import { query as q } from 'faunadb';

import { fauna } from "../../../services/fauna";
import { stripe } from '../../../services/stripe';

export async function saveSubscription(
    subscriptionId: string,
    customersId: string,
    createAction = false,
) {
    const userRef = await fauna.query(
        q.Select(
            'ref',
            q.Get(
                q.Match(
                    q.Index('user_by_stripe_customer_id'),
                    customersId
                )
            )
        )
    )

    const subscriptions = await stripe.subscriptions.retrieve(subscriptionId)

    const subscriptionData = {
        id: subscriptions.id,
        userId: userRef,
        status: subscriptions.status,
        price_id: subscriptions.items.data[0].price.id,
    }

    if (createAction) {

    } else {
        await fauna.query(
            q.Replace(
                q.Select(
                    "ref",
                    q.Get(
                        q.Match(
                            q.Index('subscriptions_by_id'),
                            subscriptionId,
                        )
                    )
                ),
                { data: subscriptionData }
            )
        )
    }
}