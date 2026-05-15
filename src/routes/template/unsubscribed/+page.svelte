<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card';
</script>

<div class="flex min-h-svh items-center justify-center bg-background">
	<Card.Root class="w-full max-w-md">
		<Card.Header>
			<Card.Title>Je nám líto, že nás opouštíte.</Card.Title>
		</Card.Header>
		<Card.Content class="text-sm text-muted-foreground">
			<p>
				Odhlášení proběhlo v pořádku. Od tohoto okamžiku, nebudete přijímat e-mailový marketing.
			</p>
		</Card.Content>
		<Card.Footer class="flex justify-end">
			<Button>Zavřít</Button>
		</Card.Footer>
	</Card.Root>
</div>
