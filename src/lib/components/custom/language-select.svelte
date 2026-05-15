<script lang="ts">
	import * as Select from '$lib/components/ui/select/index.js';

	const languages = [
		{ value: 'czech', label: 'Czech', image: '/flags/cz.svg' },
		{ value: 'english', label: 'English', image: '/flags/gb.svg' },
		{ value: 'german', label: 'German', image: '/flags/de.svg' }
	];

	let value = $state('czech');
</script>

<Select.Root type="single" bind:value>
	<Select.Trigger>
		<img
			src={languages.find((lang) => lang.value === value)?.image}
			alt={value}
			class="size-4 rounded-sm"
		/>
		<span>
			{languages.find((lang) => lang.value === value)?.label}
		</span>
	</Select.Trigger>
	<Select.Content>
		<Select.Group>
			<Select.Label>Languages</Select.Label>
			{#each languages as language (language.value)}
				<Select.Item
					value={language.value}
					label={language.label}
					disabled={language.value === 'grapes'}
				>
					<img src={language.image} alt={language.label} class="size-4 rounded-sm" />
					<span>
						{language.label}
					</span>
				</Select.Item>
			{/each}
		</Select.Group>
	</Select.Content>
</Select.Root>
