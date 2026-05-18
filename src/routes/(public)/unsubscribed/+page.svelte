<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card';
	import * as m from '$lib/paraglide/messages.js';
</script>

<div class="flex min-h-svh items-center justify-center bg-background">
	<Card.Root class="w-full max-w-md">
		<Card.Header>
			<Card.Title>{m.unsubscribed_title()}</Card.Title>
		</Card.Header>
		<Card.Content class="text-sm text-muted-foreground">
			<p>{m.unsubscribed_body()}</p>
		</Card.Content>
		<Card.Footer class="flex justify-end">
			<Button>{m.common_close()}</Button>
		</Card.Footer>
	</Card.Root>
</div>
