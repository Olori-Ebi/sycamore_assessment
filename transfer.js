import http from 'k6/http';

export default function () {
    http.post('http://localhost:3000/api/transfer', JSON.stringify({
        fromWalletId: "2403e171-cd75-40cb-84f8-6b55dbdb917c",
        toWalletId: "aec93e61-513b-47cc-a484-ff7170765145",
        amount: 100,
        idempotencyKey: `${__VU}-${__ITER}`
    }), {
        headers: { 'Content-Type': 'application/json' }
    });
}
